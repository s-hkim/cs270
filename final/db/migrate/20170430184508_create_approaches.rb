class CreateApproaches < ActiveRecord::Migration[5.0]
  def change
    create_table :approaches do |t|
      t.date :close_approach_date
      t.float :epoch_date_close_approach
      t.float :relative_velocity
      t.float :miss_distance
      t.string :orbiting_body
      t.timestamps
    end
  end
end
