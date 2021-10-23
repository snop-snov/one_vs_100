class User::Cheering < ApplicationRecord
  EMPLOYEE_ROLES = %w[developer devops sales]

  belongs_to :user, dependent: :destroy

  validates :employee_role, presence: true, inclusion: { in: EMPLOYEE_ROLES }
end
