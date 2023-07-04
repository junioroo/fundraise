# frozen_string_literal: true

Rails.application.routes.draw do
  resource :api do
    resources :project, only: %i[create increase_cap]
    resources :contract, only: %i[index]
  end
end
