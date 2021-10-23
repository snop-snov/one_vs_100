class Web::HomeController < Web::ApplicationController
  def show
    @user = current_user || User.create!
    session[:user_id] = @user.id

    @cheerings = []

    User::Cheering::EMPLOYEE_ROLES.each do |role|
      c = @user.cheerings.find_by(employee_role: role)
      if c.present?
        @cheerings << c
      else
        @new_cheering = @user.cheerings.build(employee_role: role)
        break
      end
    end
  end
end
