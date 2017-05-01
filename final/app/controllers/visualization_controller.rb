class VisualizationController < ApplicationController
  def index
    redirect_to action: 'main'
  end
  def main
    # use gon gem to pass variables to javascript
    gon.asteroids = '{}'
    gon.planets = '{}'
    
    gon.asteroids = Asteroid.all.map { | x | x.format_to_NAPI }

    # https://ssd.jpl.nasa.gov/txt/p_elem_t1.txt
    f = File.read("public/planets.json")
    gon.planets = JSON.parse(f)
  end


end
