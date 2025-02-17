class ApplicationController < ActionController::API
    # Prevent CSRF attacks by raising an exception.
    # For APIs, you may want to use :null_session instead.
    #protect_from_forgery with: :null_session

    include ActionController::HttpAuthentication::Token::ControllerMethods
    # DeviseController.respond_to :html, :json

    before_action :configure_permitted_parameters, if: :devise_controller?
    before_action :authenticate_user

    def underscore_params!
        params.deep_transform_keys!(&:underscore)
    end

    private

    def configure_permitted_parameters		
        devise_parameter_sanitizer.permit(:sign_up, keys: [:email, :password])
        devise_parameter_sanitizer.permit(:account_update, keys: [:email, :password, :password_confirmation, :current_password])
    end

    #authenticate  user by checking if incoming request has a valid JWT token
    def authenticate_user
        if request.headers['Authorization'].present?
          authenticate_or_request_with_http_token do |token|
            begin
              jwt_payload = JWT.decode(token, Rails.application.credentials.secret_key_base).first

              #remember the currently authenicated users id.
              @current_user_id = jwt_payload['id']
            rescue JWT::ExpiredSignature, JWT::VerificationError, JWT::DecodeError
              head :unauthorized
            end
          end
        end
    end

    def authenticate_user!(options = {})
        head :unauthorized unless signed_in?
    end

    #get the User object for the currently authenicated user.
    def current_user
        @current_user ||= User.find(@current_user_id)
    end

    def signed_in?
        @current_user_id.present?
    end
end
