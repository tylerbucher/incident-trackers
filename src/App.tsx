import React, {useEffect, useState} from "react";
import {Drawer, em, Group, RingProgress, Stack, Text} from "@mantine/core";
import {useDisclosure, useInterval, useLocalStorage, useMediaQuery} from "@mantine/hooks";
import {DateInput} from "@mantine/dates";

function calcDays(first: number, second: number) {
    return Math.round((first - second) / (1000 * 60 * 60 * 24));
}

function App() {
    const isMobile = useMediaQuery(`(max-width: ${em(750)})`);

    const [startDate, setStartDate] = useLocalStorage({
        key: 'startDate',
        defaultValue: new Date(),
        serialize: (value) => value.toString(),
        deserialize: (value) => new Date(value ?? 0),
    });
    const [seconds, setSeconds] = useState(() => {
        const d = new Date();
        return 86400 - ((24 * 60 * 60) - (d.getHours() * 60 * 60) - (d.getMinutes() * 60) - d.getSeconds());
    });
    const [days, setDays] = useState(calcDays(Date.now(), startDate.getTime()));
    const interval = useInterval(() => setSeconds((s) => {
        if (s > 86400) {
            setDays(d => d + 1);
            return 1;
        }

        return s + 1;
    }), 1000); // if s == 86400 reset to 0
    const [opened, {open, close}] = useDisclosure(false);

    useEffect(() => {
        setDays(calcDays(Date.now(), startDate.getTime()));
    }, [startDate]);

    const updateStartDate = (val: Date | null) => {
        if (val === null || val === undefined) {
            return;
        }

        setStartDate(val);
    };

    useEffect(() => {
        interval.start();
        return interval.stop;
        // eslint-disable-next-line
    }, []);

    return (
        <React.Fragment>
            <Stack
                h={"100vh"}
                justify={"center"}
            >
                <Group justify={"center"}>
                    <RingProgress
                        sections={[{value: seconds / 864.0, color: 'yellow'}]}
                        size={isMobile ? 350 : 500}
                        thickness={24}
                        label={
                            <Stack align="center" style={{gap: 0, cursor: "pointer"}} onClick={open}>
                                <Text variant="gradient"
                                      gradient={{from: 'pink', to: 'yellow', deg: 135}}
                                      fw={700}
                                      fz={isMobile ? "50px" : "100px"} lh={1}
                                >
                                    {days}
                                </Text>
                                <Text c="gray" fw={400} ta="center" size="xl">
                                    days
                                </Text>
                            </Stack>
                        }
                    />
                </Group>
            </Stack>
            <Drawer opened={opened} onClose={close} title="Start date" position={"right"}>
                <DateInput
                    value={startDate}
                    onChange={updateStartDate}
                    label="Start date"
                    placeholder="Date"
                    style={{width: "100%"}}
                />
            </Drawer>
        </React.Fragment>
    );
}

export default App;
