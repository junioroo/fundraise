# frozen_string_literal: true

class ContractController < ApplicationController
  def index
      render json: Contract.last
  end
end
