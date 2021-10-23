Rails.application.routes.draw do
  scope module: :web do
    resources :sessions, only: %i[destroy]
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
