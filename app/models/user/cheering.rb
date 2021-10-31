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

  validates :employee_role, presence: true, inclusion: { in: self.employee_role_types }
  validates :text, presence: true, format: { with: /\A[a-zA-Z0-9А-Яа-я]+\z/ }
end
