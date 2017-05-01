class Asteroid < ApplicationRecord
    has_many :approaches
    has_and_belongs_to_many :users
    
    def next_earth_approach
        next_app = self.approaches.by_orbiting_body('Earth').next_approach[0]
        if next_app
            next_app["close_approach_date"]                    
        else
            'N/A'
        end
    end
    
    def next_earth_vel
        next_app = self.approaches.by_orbiting_body('Earth').next_approach[0]
        if next_app
            next_app["relative_velocity"].round(2)                 
        else
            'N/A'
        end
    end
    
    def format_to_NAPI 
        parsed = self.as_json
        parsed["estimated_diameter"] = {
            meters: {
                estimated_diameter_max: parsed["estimated_diameter_max"],
                estimated_diameter_min: parsed["estimated_diameter_min"]
            }
        }
        parsed["orbital_data"] = {
            orbit_id: parsed["orbit_id"],
            orbit_determination_date: parsed["orbit_determination_date"],
            orbit_uncertainty: parsed["orbit_uncertainty"],
            minimum_orbit_intersection: parsed["minimum_orbit_intersection"],
            jupiter_tisserand_invariant: parsed["jupiter_tisserand_invariant"],
            epoch_osculation: parsed["epoch_osculation"],
            eccentricity: parsed["eccentricity"],
            semi_major_axis: parsed["semi_major_axis"],
            inclination: parsed["inclination"],
            ascending_node_longitude: parsed["ascending_node_longitude"],
            orbital_period: parsed["orbital_period"],
            perihelion_distance: parsed["perihelion_distance"],
            perihelion_argument: parsed["perihelion_argument"],
            aphelion_distance: parsed["aphelion_distance"],
            perihelion_time: parsed["perihelion_time"],
            mean_anomaly: parsed["mean_anomaly"],
            mean_motion: parsed["mean_motion"],
            equinox: parsed["equinox"]
        }
        parsed
    end
    
    def self.search(search)
      if search
        where ['name LIKE ?', "%#{search}%"]
      else
        all
      end
    end
end
