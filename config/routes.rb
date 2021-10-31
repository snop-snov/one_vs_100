Rails.application.routes.draw do
  scope module: :web do
    resource :session, only: %i[destroy]
    resources :wins, only: %i[index]
    resource :game, only: %i[show]
    resource :user, only: %i[new create] do
      scope module: :users do
        resources :cheerings, only: %i[new create]
      end
    end
  end

  namespace :api do
    resource :user, only: %i[] do
      scope module: :users do
        resources :cheerings, only: %i[index]
        resources :wins, only: %i[index create]
      end
    end
  end

  root to: 'web/home#show'
end
