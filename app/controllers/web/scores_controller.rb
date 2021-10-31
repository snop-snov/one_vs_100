class Web::ScoresController < Web::ApplicationController
  skip_before_action :authenticate_user!, only: %i[show]

  def show
  end
end
