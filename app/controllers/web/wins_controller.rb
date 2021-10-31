class Web::WinsController < Web::ApplicationController
  skip_before_action :authenticate_user!, only: %i[index]

  def index
    all_wins_scope = User::Win.order(cheering_length: :desc, time: :asc)
    @all_wins = all_wins_scope.first(10)
    @all_wins_count = all_wins_scope.count

    if current_user.present?
      user_wins_scope = current_user.wins.order(cheering_length: :desc, time: :asc)
      @user_wins = user_wins_scope.first(10)
      @user_wins_count = user_wins_scope.count
    end
  end
end
