# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20170501043617) do

  create_table "approaches", force: :cascade do |t|
    t.date     "close_approach_date"
    t.float    "epoch_date_close_approach"
    t.float    "relative_velocity"
    t.float    "miss_distance"
    t.string   "orbiting_body"
    t.datetime "created_at",                null: false
    t.datetime "updated_at",                null: false
    t.integer  "asteroid_id"
    t.index ["asteroid_id"], name: "index_approaches_on_asteroid_id"
  end

  create_table "asteroids", force: :cascade do |t|
    t.string   "name"
    t.integer  "neo_reference_id"
    t.string   "nasa_jpl_url"
    t.float    "absolute_magnitude_h"
    t.boolean  "is_potentially_hazardous_asteroid"
    t.float    "estimated_diameter_min"
    t.float    "estimated_diameter_max"
    t.integer  "orbit_id"
    t.datetime "orbit_determination_date"
    t.float    "orbit_uncertainty"
    t.float    "minimum_orbit_intersection"
    t.float    "jupiter_tisserand_invariant"
    t.float    "epoch_osculation"
    t.float    "eccentricity"
    t.float    "semi_major_axis"
    t.float    "inclination"
    t.float    "ascending_node_longitude"
    t.float    "orbital_period"
    t.float    "perihelion_distance"
    t.float    "perihelion_argument"
    t.float    "aphelion_distance"
    t.float    "perihelion_time"
    t.float    "mean_anomaly"
    t.float    "mean_motion"
    t.string   "equinox"
    t.datetime "created_at",                        null: false
    t.datetime "updated_at",                        null: false
  end

  create_table "asteroids_users", id: false, force: :cascade do |t|
    t.integer "asteroid_id", null: false
    t.integer "user_id",     null: false
    t.index ["asteroid_id", "user_id"], name: "index_asteroids_users_on_asteroid_id_and_user_id"
    t.index ["user_id", "asteroid_id"], name: "index_asteroids_users_on_user_id_and_asteroid_id"
  end

  create_table "users", force: :cascade do |t|
    t.string   "email",                  default: "",    null: false
    t.string   "encrypted_password",     default: "",    null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,     null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.datetime "created_at",                             null: false
    t.datetime "updated_at",                             null: false
    t.boolean  "admin",                  default: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

end
