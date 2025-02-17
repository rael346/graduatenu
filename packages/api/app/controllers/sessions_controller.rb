class SessionsController < Devise::SessionsController
  include ActionController::MimeResponds

  def create
    user = User.find_by_email(sign_in_params[:email])

     if user && user.valid_password?(sign_in_params[:password])
      @current_user = user
    else
      render json: { error: { 'email or password' => ['is invalid'] } }, status: :unprocessable_entity
    end
  end
end
