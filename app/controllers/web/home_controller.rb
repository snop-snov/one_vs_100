class Web::HomeController < Web::ApplicationController
  def show
    @user = current_user || User.create!
    session[:user_id] = @user.id
  end
end
