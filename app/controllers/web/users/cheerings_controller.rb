class Web::Users::CheeringsController < Web::Users::ApplicationController
  def create
    create_params = params.required(:user_cheering).permit(:employee_role, :text)
    resource_user.cheerings.create(create_params)

    redirect_to root_path
  end
end
