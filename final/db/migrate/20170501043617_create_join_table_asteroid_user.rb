class CreateJoinTableAsteroidUser < ActiveRecord::Migration[5.0]
  def change
    create_join_table :asteroids, :users do |t|
      t.index [:asteroid_id, :user_id]
      t.index [:user_id, :asteroid_id]
    end
  end
end
