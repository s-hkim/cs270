# Model does the actual work, not the controller.
class Quiz
  # set up the initial values of the instance variables
  def initialize (type)
    @questions = JSON.parse(File.read("#{Rails.root}/app/assets/data/#{type}_questions.json"))
    @questionsCompleted = 0
    @questionsCorrect = 0
    @questionsMissed = []
  end
  
  def self.findQuizzes
    Dir["#{Rails.root}/app/assets/data/*"].map { |q| q.split('/')[-1].split('_')[0] }
  end

  def nextQuestion (res)
    if res == 'correct'
      @questionsCorrect += 1 
    else
      @questionsMissed.push(currentQuestion)
    end
    @questionsCompleted += 1
  end
  
  # return last missed question
  def previousQuestion
    @questionsMissed.pop
  end

  # return the current question to be displayed
  def currentQuestion
    @questions[@questionsCompleted]
  end

  # return true if there are more questions available
  def moreQuestions?
    @questionsCompleted < @questions.length
  end
  
  def missedQuestions?
    @questionsMissed.length > 0
  end

  # restart the quiz by resetting the instance variables that track the user's progress
  def startOver!
    @questionsCompleted = 0
    @questionsCorrect = 0
    @questionsMissed = []
  end
  
  def results
    @questionsCorrect
  end
  
  def score
    if @questionsCompleted == 0
      0
    else
      100 * @questionsCorrect / @questionsCompleted
    end
  end
end
