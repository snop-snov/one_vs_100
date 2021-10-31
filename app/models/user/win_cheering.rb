class User::WinCheering < ApplicationRecord
  belongs_to :win, foreign_key: :user_win_id, class_name: 'User::Win'
  belongs_to :cheering, foreign_key: :user_cheering_id, class_name: 'User::Cheering'
end
