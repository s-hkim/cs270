class Comment < ApplicationRecord
    validates :content, presence: true, length: { maximum: 140, message: "too long" }
    belongs_to :user
    belongs_to :post
end
