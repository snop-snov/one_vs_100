class User::Cheering < ApplicationRecord
  EMPLOYEE_ROLES = [
    {type: 'developer', color: '#fdd835'},
    {type: 'devops', color: 'green'},
    {type: 'sales', color: '#2196F3'}
  ]

  class << self
    def employee_role_types
      EMPLOYEE_ROLES.map { |r| r[:type] }
    end
  end

  belongs_to :user
  has_many :win_cheerings, foreign_key: :user_win_id, class_name: 'User::WinCheering'
  has_many :wins, through: :win_cheerings, class_name: 'User::Win'

  validates :employee_role, presence: true, inclusion: { in: self.employee_role_types }
  validates :text, presence: true, format: { with: /\A[a-zA-Z0-9А-Яа-яё]+\z/ }

  def color
    role = EMPLOYEE_ROLES.find { |r| r[:type] == employee_role }
    role[:color] if role.present?
  end
end
