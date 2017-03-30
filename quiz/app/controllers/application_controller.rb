require 'quiz'

# note, each public method defines a "page", a response to a URL
class ApplicationController < ActionController::Base
  # prevent CSRF attacks by raising an exception
  protect_from_forgery with: :exception

  # create ONE copy of our model class for all methods to share
  @@quiz = nil

  def index
    @title = 'Take a Quiz! Any Quiz!'
    @types = Quiz.findQuizzes
  end
  def create
    @type = "#{params[:type]}"
    @@quiz = Quiz.new(@type)
    redirect_to action: 'start'
  end
  
  # start a quiz from its current location
  def start
    @title = 'Pop Quiz'
    @currentQuestion = @@quiz.currentQuestion
  end

  # check the results of the user's response on submit
  def submit
    @title = "#{params[:result]}"
    @@quiz.nextQuestion(params[:result])
    if not @@quiz.moreQuestions?
      redirect_to action: 'results'
    else
      # no matter what set this variable so it can be used in HTML view
      @currentQuestion = @@quiz.currentQuestion
      @hasMissed = @@quiz.missedQuestions?
    end
  end

  def previous
    @title = 'Missed'
    @currentQuestion = @@quiz.previousQuestion
  end

  # end a quiz by showing the results of how many questions were answered correctly
  def results
    # TODO: replace line below and instead store results in variables for use by the results view
    @correct = @@quiz.results
    @score = @@quiz.score
    @title = 'Results'
    @notice = 'Questions correct: '
    @percentage = 'Your score: '
  end

  # start a quiz from the beginning
  def restart
    # reset the quiz and redirect to the beginning route
    @@quiz.startOver!
    redirect_to action: 'start'
  end
end
