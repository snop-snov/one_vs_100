class ApplicationController < ActionController::Base
  before_action :authenticate_user!
  # before_action :allow_iframe_requests

  helper_method :current_user

  def authenticate_user!
    return redirect_to new_user_path if current_user.blank?
    session[:user_id] = current_user.id
  end

  def current_user
    User.find(session[:user_id]) if session[:user_id].present?
  end

  # def allow_iframe_requests
  #   response.headers.delete('X-Frame-Options')
  # end
end
