class Api::Users::CheeringsController < Api::Users::ApplicationController
  def index
    cheerings = current_user.cheerings
    data = cheerings.select(:id, :employee_role, :text).as_json

    render json: {user_cheerings: data}
  end
end
