class Web::HomeController < Web::ApplicationController
  def show
    redirect_to current_user.present? ? new_user_cheering_path : new_user_path
  end
end
