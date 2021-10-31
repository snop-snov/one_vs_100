class User::Win < ApplicationRecord
  has_many :win_cheerings, foreign_key: :user_win_id
  has_many :cheerings, through: :win_cheerings

  validates :time, presence: true
  validates :cheering_length, presence: true
end
