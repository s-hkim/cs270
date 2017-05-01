class FavoritesController < ApplicationController
  before_action :authenticate_user!
  before_action :check_user
  def check_user
    if !user_signed_in?
      redirect_to asteroids_path
    else
      @favorites = current_user.asteroids
    end
  end
  def index
   
  end

  def show
  end
  def add
    ast = params[:asteroid]
    if current_user.asteroids.where("id = ?", ast.to_i).empty?
        current_user.asteroids << Asteroid.find(ast)
    end
    redirect_to favorites_path
  end
  def destroy
      current_user.asteroids.delete(Asteroid.find(params[:asteroid]))
      redirect_to favorites_path
  end

end