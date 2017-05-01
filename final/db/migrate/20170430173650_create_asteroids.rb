class CreateAsteroids < ActiveRecord::Migration[5.0]
  def change
    create_table :asteroids do |t|
      t.string :name
      t.integer :neo_reference_id
      t.string :nasa_jpl_url
      t.float :absolute_magnitude_h
      t.boolean :is_potentially_hazardous_asteroid
      t.float :estimated_diameter_min
      t.float :estimated_diameter_max
      t.integer :orbit_id
      t.datetime :orbit_determination_date
      t.float :orbit_uncertainty
      t.float :minimum_orbit_intersection
      t.float :jupiter_tisserand_invariant
      t.float :epoch_osculation
      t.float :eccentricity
      t.float :semi_major_axis
      t.float :inclination
      t.float :ascending_node_longitude
      t.float :orbital_period
      t.float :perihelion_distance
      t.float :perihelion_argument
      t.float :aphelion_distance
      t.float :perihelion_time
      t.float :mean_anomaly
      t.float :mean_motion
      t.string :equinox
      t.timestamps
    end
  end
end
