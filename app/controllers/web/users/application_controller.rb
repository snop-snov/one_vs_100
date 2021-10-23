class Web::Users::ApplicationController < Web::ApplicationController
  def resource_user
    User.find(params[:user_id])
  end
end
