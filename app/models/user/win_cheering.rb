class User::WinCheering < ApplicationRecord
  belongs_to :win, foreign_key: :user_win_id
  belongs_to :cheering, foreign_key: :user_cheering_id
end
