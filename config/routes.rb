Rails.application.routes.draw do
  scope module: :web do
    resource :session, only: %i[destroy]
    resource :game, only: %i[show]
    resource :user, only: %i[] do
      scope module: :users do
        resources :cheerings, only: %i[new create]
      end
    end
  end

  namespace :api do
    resource :user, only: %i[] do
      scope module: :users do
        resources :cheerings, only: %i[index]
      end
    end
  end

  root to: 'web/home#show'
end
