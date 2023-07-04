# frozen_string_literal: true

class Contract < ApplicationRecord
  has_many :projects, dependent: :destroy
end
