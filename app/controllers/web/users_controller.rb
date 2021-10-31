class Web::UsersController < Web::ApplicationController
  skip_before_action :authenticate_user!, only: %i[new create]

  def new
    @new_user = User.new
  end

  def create
    create_params = params.required(:user).permit(:name)
    user = User.new(create_params)

    if user.save
      session[:user_id] = user.id
      redirect_to new_user_cheering_path
    else
      @new_user = user
      render :new
    end
  end
end
