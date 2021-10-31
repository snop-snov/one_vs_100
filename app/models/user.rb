class User < ApplicationRecord
  has_many :cheerings, dependent: :destroy
  has_many :wins, dependent: :destroy
end
