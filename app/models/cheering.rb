class Cheering < ApplicationRecord
  EMPLOYEE_ROLES = %w[developer manager sales]

  belongs_to :user, dependent: :destroy
end
