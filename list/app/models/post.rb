class Post < ApplicationRecord
    validates :title, presence: true
    validates :content, presence: true
    validates :category, presence: true
    belongs_to :user
    has_many :comments
    
    def self.search(search)
      if search
        where ['title LIKE ?', "%#{search}%"]
      else
        all
      end
    end
end
