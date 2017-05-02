class AsteroidsController < ApplicationController
    include SmartListing::Helper::ControllerExtensions
    helper SmartListing::Helper

  # GET /asteroids
  def index
    asteroids_scope = Asteroid.all
    if params[:filter]
        # search by name
        asteroids_scope = Asteroid.where("name LIKE ?", "%#{params[:filter]}%")
    end
    # use gon gem to pass variables to javascript
    gon.asteroids = '{}'
    gon.planets = '{}'

    # if user is not signed in, just display any 5 asteroids
    diag_ast = asteroids_scope.limit(5);

    if user_signed_in?
      diag_ast = current_user.asteroids
    end

    # reformat the data because our model is different from NASA's
    gon.asteroids = diag_ast.map { | x | x.format_to_NAPI }

    # get planet data
    # https://ssd.jpl.nasa.gov/txt/p_elem_t1.txt
    f = File.read("public/planets.json")
    gon.planets = JSON.parse(f)

    @asteroids = smart_listing_create(:asteroids, asteroids_scope, partial: "asteroids/table", default_sort: {is_potentially_hazardous_asteroid: "desc"})

  end

  def show
  end

  # GET /data.json
  def retrieve
    @asteroids = Asteroid.all
    respond_to do |format|
        format.json  { render :json => @asteroids }
    end
  end

end
