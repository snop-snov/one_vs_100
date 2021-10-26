class ApplicationController < ActionController::Base
  before_action :authenticate_user!

  helper_method :current_user

  def authenticate_user!
    @user = current_user || User.create!
    session[:user_id] = @user.id
  end

  def current_user
    User.find(session[:user_id]) if session[:user_id].present?
  end
end
