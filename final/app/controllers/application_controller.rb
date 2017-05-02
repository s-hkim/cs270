class ApplicationController < ActionController::Base

  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  def index
    if user_signed_in? and current_user.admin?
      # show the admin page
    else
      redirect_to asteroids_path
    end
  end

  # pull data from the NASA API and update the database
  def updateDB
    page_limit = 10     # number of pages to retrieve (trying to get all >800 pages results in the request timing out)
    counter = page_limit
    visited = []
    u = 'https://api.nasa.gov/neo/rest/v1/neo/browse'
    uri = URI(u)
    uri.query = URI.encode_www_form({
      api_key: Rails.application.secrets.neo_api_key
    })
    loop do
      results = Net::HTTP.get_response(uri)
      if results.is_a?(Net::HTTPSuccess)
        asteroids = JSON.parse(results.body)
        asteroids["near_earth_objects"].each do |i|
          # logger.debug i
          parsed = {}
          begin
            parsed = {
              neo_reference_id: i["neo_reference_id"],
              name: i["name"],
              id: i["neo_reference_id"],
              nasa_jpl_url: i["nasa_jpl_url"],
              absolute_magnitude_h: i["absolute_magnitude_h"],
              estimated_diameter_min: i["estimated_diameter"]["meters"]["estimated_diameter_min"],
              estimated_diameter_max: i["estimated_diameter"]["meters"]["estimated_diameter_max"],
              is_potentially_hazardous_asteroid: i["is_potentially_hazardous_asteroid"],
              orbit_id: i["orbital_data"]["orbit_id"],
              orbit_determination_date: i["orbital_data"]["orbit_determination_date"],
              orbit_uncertainty: i["orbital_data"]["orbit_uncertainty"],
              minimum_orbit_intersection: i["orbital_data"]["minimum_orbit_intersection"],
              jupiter_tisserand_invariant: i["orbital_data"]["jupiter_tisserand_invariant"],
              epoch_osculation: i["orbital_data"]["epoch_osculation"],
              eccentricity: i["orbital_data"]["eccentricity"],
              semi_major_axis: i["orbital_data"]["semi_major_axis"],
              inclination: i["orbital_data"]["inclination"],
              ascending_node_longitude: i["orbital_data"]["ascending_node_longitude"],
              orbital_period: i["orbital_data"]["orbital_period"],
              perihelion_distance: i["orbital_data"]["perihelion_distance"],
              perihelion_argument: i["orbital_data"]["perihelion_argument"],
              aphelion_distance: i["orbital_data"]["aphelion_distance"],
              perihelion_time: i["orbital_data"]["perihelion_time"],
              mean_anomaly: i["orbital_data"]["mean_anomaly"],
              mean_motion: i["orbital_data"]["mean_motion"],
              equinox: i["orbital_data"]["equinox"]
            }
          rescue
            logger.error 'error parsing data'
            next
          end
          ast = {}
          begin
              # check if asteroid already exists
              ast = Asteroid.find(parsed[:id])
              ast.update_attributes(parsed)
          rescue
            begin
              ast = Asteroid.create!(parsed)
            rescue
              logger.error 'error creating asteroid'
              next
            end
          end


          i["close_approach_data"].each do |j|
            appr = {
              close_approach_date: j["close_approach_date"],
              epoch_date_close_approach: j["epoch_date_close_approach"],
              relative_velocity: j["relative_velocity"]["kilometers_per_second"],
              miss_distance: j["miss_distance"]["kilometers"],
              orbiting_body: j["orbiting_body"]
            }
            begin
              appro = ast.approaches.find_by(close_approach_date: appr[:close_approach_date])
              if appro.blank?
                throw 'approach not in database'
              else
                appro.update_attributes(appr)
              end
            rescue
              begin
                ast.approaches.create(appr)
              rescue
                logger.error 'error creating approach'
                next
              end
            end
          end
        end
        counter -= 1
        visited.push(u)
        u = asteroids['links']['next']
      else
        logger.error 'error accessing data'
        break
      end
      break if counter <= 0 || visited.include?(u) || !u.present?
      uri = URI(u)
    end

    redirect_to root_path
  end

end
