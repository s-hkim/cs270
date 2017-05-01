class AsteroidsController < ApplicationController
    include SmartListing::Helper::ControllerExtensions 
    helper SmartListing::Helper
#   before_action :set_asteroid, only: [:show, :edit, :update, :destroy]
#   before_action :authenticate_user!, only: [:new, :edit, :update, :destroy]
#   before_action :check_user, only: [:edit, :update, :destroy]

  # GET /asteroids
  # GET /asteroids.json
  def index
    asteroids_scope = Asteroid.all
    if params[:filter]
        asteroids_scope = Asteroid.where("name LIKE ?", "%#{params[:filter]}%") 
    end
    # use gon gem to pass variables to javascript
    gon.asteroids = '{}'
    gon.planets = '{}'
    
    diag_ast = asteroids_scope.limit(5);
    
    if user_signed_in?
      diag_ast = current_user.asteroids
    end
    
    gon.asteroids = diag_ast.map { | x | x.format_to_NAPI }

    # https://ssd.jpl.nasa.gov/txt/p_elem_t1.txt
    f = File.read("public/planets.json")
    gon.planets = JSON.parse(f)
    
    @asteroids = smart_listing_create(:asteroids, asteroids_scope, partial: "asteroids/table", default_sort: {is_potentially_hazardous_asteroid: "desc"})
    
  end

  # GET /asteroids/1
  # GET /asteroids/1.json
  def show
  end
  
  def retrieve
    @asteroids = Asteroid.all
    respond_to do |format|
        format.json  { render :json => @asteroids }
    end
  end

end