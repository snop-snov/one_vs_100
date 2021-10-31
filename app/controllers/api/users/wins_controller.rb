class Api::Users::WinsController < Api::Users::ApplicationController
  def index
    wins = current_user.wins
    data = wins.select(:id, :time, :cheering_length).as_json

    render json: {user_wins: data}
  end

  def create
    create_params = params.required(:user_win).permit(:time)
    create_params[:user_id] = current_user.id
    create_params[:cheering_length] = current_user.cheerings.pluck(:text).sum(&:length)

    win = current_user.wins.build(create_params)

    if win.save
      win.cheerings = current_user.cheerings
      render json: {status: :created}.as_json, status: :created
    else
      render json: {errors: win.errors}.as_json
    end
  end
end
