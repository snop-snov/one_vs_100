Rails.application.routes.draw do
  scope module: :web do
    resources :sessions, only: %i[destroy]
  end

  scope module: :api do
  end

  root to: 'web/home#show'
end
