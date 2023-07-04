# frozen_string_literal: true

class ProjectController < ApplicationController
  def create
     ActiveRecord::Base.transaction do

      project = ::App::ProjectService.new(project_params).create

      render json: project
    end
  end

  private
  def project_params
    params.require(:project).permit(:name, :url, :max_cap_per_investor, :transaction_hash, :contract_id)
  end
end
