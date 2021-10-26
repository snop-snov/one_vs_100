class Api::ApplicationController < ApplicationController
  include ActionController::MimeResponds

  respond_to :json
end
