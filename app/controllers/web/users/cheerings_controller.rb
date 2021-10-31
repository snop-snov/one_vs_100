class Web::Users::CheeringsController < Web::Users::ApplicationController
  def new
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

  def create
    create_params = params.required(:user_cheering).permit(:employee_role, :text)
    cheering = current_user.cheerings.find_or_initialize_by(employee_role: create_params[:employee_role])

    cheering.assign_attributes(create_params)

    if cheering.save
      cheering_length = current_user.cheerings.pluck(:text).sum(&:length)
      current_user.update(cheering_length: cheering_length)

      redirect_to new_user_cheering_path
    else
      @new_cheering = cheering
      render :new
    end
  end
end
