Rails.application.routes.draw do
  scope module: :web do
    resource :session, only: %i[destroy]
    resource :game, only: %i[show]
    resources :users, only: %i[] do
      scope module: :users do
        resources :cheerings, only: %i[create]
      end
    end
  end

  scope module: :api do
  end

  root to: 'web/home#show'
end
