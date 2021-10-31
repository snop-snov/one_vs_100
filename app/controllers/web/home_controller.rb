class Web::HomeController < Web::ApplicationController
  def show
    redirect_to new_user_cheering_path
  end
end
