class User::Win < ApplicationRecord
  belongs_to :user

  has_many :win_cheerings, foreign_key: :user_win_id, class_name: 'User::WinCheering'
  has_many :cheerings, through: :win_cheerings, class_name: 'User::Cheering'

  validates :time, presence: true
  validates :cheering_length, presence: true
end
