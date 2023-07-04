# frozen_string_literal: true

class CreateContracts < ActiveRecord::Migration[7.0]
  def change
    create_table :contracts do |t|
      t.timestamps

      t.string :address
    end
  end
end
