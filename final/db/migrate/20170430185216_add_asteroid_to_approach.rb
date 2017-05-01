class AddAsteroidToApproach < ActiveRecord::Migration[5.0]
  def change
    add_reference :approaches, :asteroid, foreign_key: true
  end
end
