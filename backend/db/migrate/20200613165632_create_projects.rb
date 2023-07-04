# frozen_string_literal: true

class CreateProjects < ActiveRecord::Migration[7.0]
  def change
    create_table :projects do |t|
      t.timestamps

      t.belongs_to :contract, null: false, foreign_key: true
      t.string :name
      t.string :url
      t.bigint :max_cap_per_investor
      t.string :transaction_hash
    end
  end
end
