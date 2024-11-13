import Reservation from '../models/reservation.model.js'
import Table from '../models/table.model.js'


export const createTable = async (req, res) => {
    try {
        const { tableNumber, seats, isAvailable, location, specialFeatures } = req.body;

        const table = new Table({
            tableNumber,
            seats,
            isAvailable,
            location,
            specialFeatures
        });

        await table.save();
        res.status(201).json({ message: 'Table created successfully!', table });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getAllTables = async (req, res) => {
    try {
        const tables = await Table.find();
        res.status(200).json(tables);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getTableById = async (req, res) => {
    const { id } = req.params;

    try {
        const table = await Table.findById(id);

        if (!table) {
            return res.status(404).json({ message: 'Table not found' });
        }

        res.status(200).json(table);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateTable = async (req, res) => {
    const { id } = req.params;
    const { tableNumber, seats, isAvailable, location, specialFeatures } = req.body;

    try {
        const table = await Table.findByIdAndUpdate(id, {
            tableNumber,
            seats,
            isAvailable,
            location,
            specialFeatures
        }, { new: true });

        if (!table) {
            return res.status(404).json({ message: 'Table not found' });
        }

        res.status(200).json({ message: 'Table updated successfully!', table });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const deleteTable = async (req, res) => {
    const { id } = req.params;

    try {
        const table = await Table.findByIdAndDelete(id);

        if (!table) {
            return res.status(404).json({ message: 'Table not found' });
        }

        res.status(200).json({ message: 'Table deleted successfully!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createReservation = async (req, res) => {
    const { user, name, surname, email, time, guestNumber, table, status, specialMessage } = req.body;

    try {
        // Check if the table exists
        const existingTable = await Table.findById(table);

        if (!existingTable) {
            return res.status(404).json({ message: 'Table not found' });
        }

        // Check if the table has enough seats for the reservation
        if (guestNumber > existingTable.seats) {
            return res.status(400).json({ message: `Table only has ${existingTable.seats} seats, but ${guestNumber} were requested.` });
        }

        // Check if the table is available at the requested time
        const isTableAvailable = await existingTable.checkAvailability(time);
        if (!isTableAvailable) {
            return res.status(400).json({ message: 'Table is already reserved for the requested time.' });
        }

        // Create the reservation
        const reservation = new Reservation({
            user,
            name,
            surname,
            email,
            time,
            guestNumber,
            table,
            status,
            specialMessage
        });

        // Save the reservation
        await reservation.save();

        // Update the table to mark it as unavailable and associate with the reservation
        existingTable.isAvailable = false;
        existingTable.currentReservation = reservation._id;
        await existingTable.save();

        res.status(201).json({ message: 'Reservation created successfully!', reservation });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getAllReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find().populate('user', 'name email'); // populate user details if needed
        res.status(200).json(reservations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getReservationById = async (req, res) => {
    const { id } = req.params;

    try {
        const reservation = await Reservation.findById(id)
            .populate('user', 'name email') // Populate user details
            .populate('table', 'tableNumber seats location isAvailable'); // Populate table details

        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }

        res.status(200).json(reservation);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateReservation = async (req, res) => {
    const { id } = req.params; // Get the reservation ID from the URL parameters
    const { user, name, surname, email, time, guestNumber, tableNumber, status, specialMessage } = req.body;

    try {
        // Find the reservation to update
        const reservation = await Reservation.findById(id);
        
        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }

        // Check if the table has changed
        const table = await Table.findOne({ tableNumber });

        if (!table) {
            return res.status(404).json({ message: 'Table not found' });
        }

        // Check if the new table has enough seats for the reservation
        if (guestNumber > table.seats) {
            return res.status(400).json({ message: `Table only has ${table.seats} seats, but ${guestNumber} were requested.` });
        }

        // Check if the new table is available at the requested time
        const isTableAvailable = await table.checkAvailability(time);
        if (!isTableAvailable) {
            return res.status(400).json({ message: 'Table is already reserved for the requested time.' });
        }

        // Update the reservation
        reservation.user = user;
        reservation.name = name;
        reservation.surname = surname;
        reservation.email = email;
        reservation.time = time;
        reservation.guestNumber = guestNumber;
        reservation.tableNumber = tableNumber; // This should be updated to reflect the new table
        reservation.status = status;
        reservation.specialMessage = specialMessage;

        await reservation.save();

        // Update the table's current reservation only if the table has changed
        if (reservation.tableNumber !== tableNumber) {
            // Make the old table available again
            const oldTable = await Table.findOne({ tableNumber: reservation.tableNumber });
            if (oldTable) {
                oldTable.isAvailable = true;
                oldTable.currentReservation = null;
                await oldTable.save();
            }

            // Update the new table's availability
            table.isAvailable = false;
            table.currentReservation = reservation._id;
            await table.save();
        }

        res.status(200).json({ message: 'Reservation updated successfully!', reservation });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const deleteReservation = async (req, res) => {
    const { id } = req.params;

    try {
        const reservation = await Reservation.findByIdAndDelete(id);

        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }

        // Find the table associated with this reservation
        const table = await Table.findOne({ tableNumber: reservation.tableNumber });

        if (!table) {
            return res.status(404).json({ message: 'Table not found' });
        }

        // Make the table available again
        table.isAvailable = true;
        table.currentReservation = null;
        await table.save();

        res.status(200).json({ message: 'Reservation deleted and table is now available' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};