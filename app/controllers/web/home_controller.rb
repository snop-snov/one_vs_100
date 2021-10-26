class Web::HomeController < Web::ApplicationController
  def show
    @user = current_user
    @cheerings = []

    User::Cheering.employee_role_types.each do |role|
      c = @user.cheerings.find_by(employee_role: role)
      if c.present?
        @cheerings << c
      else
        @new_cheering = @user.cheerings.build(employee_role: role)
        break
      end
    end

    redirect_to game_path if @new_cheering.blank?
  end
end
